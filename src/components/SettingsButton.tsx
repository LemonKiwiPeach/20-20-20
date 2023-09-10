import React, { useState, ChangeEvent } from 'react';
import '../styles/SettingButton.css';
import '../styles/Dialog.css';
import '../styles/ControlButton.css';
import Dialog from './Dialog';
import { useSettings } from './SettingsContext';
import { openDB } from 'idb';
import { saveAudioToIndexedDB } from './dbUtils';

const SettingButton = () => {
  const { settings, setSettings } = useSettings();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSettingItem, setSelectedSettingItem] = useState<string>('notification');

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

      saveAudioToIndexedDB(newAlarmSoundFile[0], newAlarmSoundName);
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

  const handleRepeatNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const newRepeatNumber = parseInt(e.target.value);
    setSettings({
      ...settings, //
      repeatNumber: newRepeatNumber,
    });
  };

  const handleRepeatToggle = () => {
    const newIsContinuous = !settings.isContinuous;
    setSettings({
      ...settings,
      isContinuous: newIsContinuous,
    });
  };

  return (
    <>
      <div className="control-button setting-button" onClick={() => setDialogOpen(true)}>
        <i className={`fa fa-2x fa-gear`}></i>
      </div>
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
                  <div className="settings-item">
                    <label>通知メッセージ</label>
                  </div>

                  <div className="settings-item">
                    <label htmlFor="notificationStartMessage">開始時</label>
                    <input
                      type="text" //
                      id="notificationStartMessage"
                      value={settings.notificationStartMessage}
                      onChange={handleNotificationStartMessage}
                    />
                  </div>

                  <div className="settings-item">
                    <label htmlFor="notificationFinishMessage">終了時</label>
                    <input
                      type="text" //
                      id="notificationFinishMessage"
                      value={settings.notificationFinishMessage}
                      onChange={handleNotificationFinishMessage}
                    />
                  </div>

                  <div className="settings-item">
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
                  <div className="settings-item">
                    <label>アラーム音</label>
                    <label htmlFor="alarmSound" className="custom-file-upload">
                      Choose File
                    </label>
                    <input type="file" id="alarmSound" accept="audio/*" onChange={handleAlarmSoundSetting} />
                    {/* <input type="file" accept="audio/*" onChange={(e) => saveFile(e.target.files[0])} /> */}
                  </div>

                  <div className="settings-item">{settings.alarmSound}</div>

                  <div className="settings-item">
                    <label htmlFor="alarmTime">アラーム時間</label>
                    <input
                      type="number" //
                      id="alarmTime"
                      value={settings.alarmTime}
                      onChange={handleAlarmTime}
                      max={20}
                      min={1}
                    />
                  </div>
                  <div className="settings-item">
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
                  <div className="settings-item">
                    <label htmlFor="repeatToggle">繰り返し</label>
                    <button
                      id="repeatToggle" //
                      className={`toggle-button ${settings.isContinuous ? 'active' : ''}`}
                      onClick={handleRepeatToggle}
                    >
                      {settings.isContinuous ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="settings-item">
                    <label htmlFor="repeatNumber">繰り返し回数</label>
                    <input
                      type="number" //
                      id="repeatNumber"
                      value={settings.repeatNumber}
                      onChange={handleRepeatNumber}
                      max={99}
                      min={1}
                      disabled={!settings.isContinuous}
                    />
                  </div>
                </>
              )}
            </section>
          </div>
        </>
      </Dialog>
    </>
  );
};

export default SettingButton;
