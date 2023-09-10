import React, { useState, ChangeEvent } from 'react';
import '../styles/SettingButton.css';
import '../styles/Dialog.css';
import '../styles/ControlButton.css';
import Dialog from './Dialog';
import { useSettings } from './SettingsContext';
import { upsertAudioToIndexedDB } from './dbUtils';

const SettingButton = () => {
  const { settings, setSettings } = useSettings();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSettingItem, setSelectedSettingItem] = useState<string>('notification');
  const [IndexedDbkeys, setIndexedDbKeys] = useState<string[]>([]);

  // Notification start message
  const handleNotificationStartMessage = (e: ChangeEvent<HTMLInputElement>) => {
    const newNotificationMessage = e.target.value;
    setSettings({
      ...settings,
      notificationStartMessage: newNotificationMessage,
    });
  };

  // Notification finish message
  const handleNotificationFinishMessage = (e: ChangeEvent<HTMLInputElement>) => {
    const newNotificationMessage = e.target.value;
    setSettings({
      ...settings,
      notificationFinishMessage: newNotificationMessage,
    });
  };

  // Notification display time
  const handleNotificationDisplayTime = (e: ChangeEvent<HTMLInputElement>) => {
    const newNotificationDisplayTime = parseInt(e.target.value) * 1000;
    setSettings({
      ...settings,
      notificationDisplayTime: newNotificationDisplayTime,
    });
  };

  // Alarm sound
  const handleAlarmSoundSetting = async (e: ChangeEvent<HTMLInputElement>) => {
    const newAlarmSoundFile = e.target.files;
    if (newAlarmSoundFile) {
      const newAlarmSoundName = newAlarmSoundFile[0].name;
      setSettings({
        ...settings, //
        alarmSound: newAlarmSoundName,
      });

      upsertAudioToIndexedDB(newAlarmSoundFile[0], newAlarmSoundName);
    }
  };

  // Alarm time
  const handleAlarmTime = (e: ChangeEvent<HTMLInputElement>) => {
    const newAlarmTime = parseInt(e.target.value);
    setSettings({
      ...settings, //
      alarmTime: newAlarmTime,
    });
  };

  // Alarm volume
  const handleAlarmVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const newAlarmVolume = parseFloat(e.target.value);
    setSettings({
      ...settings,
      alarmVolume: newAlarmVolume,
    });
  };

  const handleRepeatToggle = () => {
    const newIsContinuous = !settings.isContinuous;
    setSettings({
      ...settings,
      isContinuous: newIsContinuous,
    });
  };

  const handleDelete = (index: number) => {
    const newKeys = [...IndexedDbkeys];
    newKeys.splice(index, 1);
    setSettings({
      ...settings, //
      alarmSounds: newKeys,
    });
  };

  const handleRadioChange = (selectedKey: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      alarmSound: selectedKey,
    }));
  };

  return (
    <>
      <div className="control-button setting-button" onClick={() => setDialogOpen(true)}>
        <i className={`fa fa-2x fa-gear`}></i>
      </div>
      {isDialogOpen && (
        <Dialog
          isOpen={isDialogOpen} //
          onClose={() => setDialogOpen(false)}
          title="Settings"
          dialogClassName="settings"
        >
          <>
            <div className="settings-wrapper">
              <aside>
                <div className={`settings-section ${selectedSettingItem === 'notification' ? 'selected' : ''}`} onClick={() => setSelectedSettingItem('notification')}>
                  通知
                </div>
                <div className={`settings-section ${selectedSettingItem === 'alarm' ? 'selected' : ''}`} onClick={() => setSelectedSettingItem('alarm')}>
                  アラーム
                </div>
                <div className={`settings-section ${selectedSettingItem === 'others' ? 'selected' : ''}`} onClick={() => setSelectedSettingItem('others')}>
                  その他
                </div>
              </aside>
              <section>
                {selectedSettingItem === 'notification' && (
                  <>
                    <div className="settings-container notification-message">
                      <label>通知メッセージ</label>
                      <div className="settings-item">
                        <div className="settings-row">
                          <label htmlFor="notificationStartMessage">開始時</label>
                          <input
                            type="text" //
                            id="notificationStartMessage"
                            value={settings.notificationStartMessage}
                            onChange={handleNotificationStartMessage}
                          />
                        </div>
                      </div>

                      <div className="settings-item">
                        <div className="settings-row">
                          <label htmlFor="notificationFinishMessage">終了時</label>
                          <input
                            type="text" //
                            id="notificationFinishMessage"
                            value={settings.notificationFinishMessage}
                            onChange={handleNotificationFinishMessage}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="settings-container">
                      <label htmlFor="notificationDisplayTime">表示時間</label>
                      <input
                        type="number" //
                        id="notificationDisplayTime"
                        value={settings.notificationDisplayTime / 1000}
                        onChange={handleNotificationDisplayTime}
                      />
                    </div>
                  </>
                )}

                {selectedSettingItem === 'alarm' && (
                  <>
                    <div className="settings-container alarm-sound">
                      <div className="settings-item alarm-sound-upload">
                        <label>アラーム音</label>
                        <label htmlFor="alarmSound" className="custom-file-upload">
                          Upload File
                        </label>
                        <input type="file" id="alarmSound" accept="audio/*" onChange={handleAlarmSoundSetting} />
                      </div>

                      <div className="settings-item">
                        {settings.alarmSounds.map((key, index) => (
                          <div key={index} className="settings-row">
                            <input
                              type="radio" //
                              id={key}
                              name="settings-radio-group"
                              checked={settings.alarmSound === key}
                              onChange={() => handleRadioChange(key)}
                            />
                            <label htmlFor={key} className="settings-content">
                              {key}
                            </label>
                            <button onClick={() => handleDelete(index)}>Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="settings-container">
                      <label htmlFor="alarmTime">アラーム時間(秒)</label>
                      <input
                        type="number" //
                        id="alarmTime"
                        value={settings.alarmTime}
                        onChange={handleAlarmTime}
                        max={20}
                        min={1}
                      />
                    </div>
                    <div className="settings-container">
                      <label htmlFor="alarmVolume">音量</label>
                      <input
                        type="number" //
                        id="alarmVolume"
                        value={settings.alarmVolume}
                        onChange={handleAlarmVolume}
                        step="0.1"
                        max="1"
                        min="0"
                      />
                    </div>
                  </>
                )}

                {selectedSettingItem === 'others' && (
                  <>
                    <div className="settings-container">
                      <label htmlFor="repeatToggle">繰り返し</label>
                      <button
                        id="repeatToggle" //
                        className={`toggle-button ${settings.isContinuous ? 'active' : ''}`}
                        onClick={handleRepeatToggle}
                      >
                        {settings.isContinuous ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </>
                )}
              </section>
            </div>
          </>
        </Dialog>
      )}
    </>
  );
};

export default SettingButton;
