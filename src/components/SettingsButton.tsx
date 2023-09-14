import React, { useState, useEffect, ChangeEvent } from 'react';
import '../styles/SettingButton.css';
import '../styles/Dialog.css';
import '../styles/ControlButton.css';
import Dialog from './Dialog';
import { useSettings } from './SettingsContext';
import { fetchAllKeysFromAudioStore, deleteAudioFromIndexedDB, upsertAudioToIndexedDB } from './dbUtils';

const SettingButton = () => {
  const { settings, setSettings } = useSettings();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSettingItem, setSelectedSettingItem] = useState<string>('notification');

  useEffect(() => {
    const fetchAlarmSounds = async () => {
      const initialAlarmSounds = await fetchAllKeysFromAudioStore();
      updateSettings('alarmSounds', initialAlarmSounds);
    };

    fetchAlarmSounds();
  }, []);

  const updateSettings = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string, multiplier = 1) => {
    updateSettings(key, e.target.valueAsNumber ? e.target.valueAsNumber * multiplier : e.target.value);
  };

  // Alarm sound
  const handleUploadingAlarmSound = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    await upsertAudioToIndexedDB(file, fileName);
    const newAlarmSounds = [...settings.alarmSounds, fileName];
    updateSettings('alarmSounds', newAlarmSounds);
    updateSettings('alarmSound', fileName);
  };

  const handleRepeatToggle = () => {
    const newIsContinuous = !settings.isContinuous;
    updateSettings('isContinuous', newIsContinuous);
  };

  const handleDeleteAlarmSound = async (key: string, index: number) => {
    if (window.confirm('Are you sure you want to delete this audio?')) {
      await deleteAudioFromIndexedDB(key);
      const newAlarmSounds = [...settings.alarmSounds];
      newAlarmSounds.splice(index, 1);
      updateSettings('alarmSounds', newAlarmSounds);
      updateSettings('alarmSound', newAlarmSounds[newAlarmSounds.length - 1] || '');
    }
  };

  const handleRadioChange = (selectedKey: string) => {
    updateSettings('alarmSound', selectedKey);
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
                            onChange={(e) => handleInputChange(e, 'notificationStartMessage')}
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
                            onChange={(e) => handleInputChange(e, 'notificationFinishMessage')}
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
                        onChange={(e) => handleInputChange(e, 'notificationDisplayTime', 1000)}
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
                        <input type="file" id="alarmSound" accept="audio/*" onChange={handleUploadingAlarmSound} />
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
                            <button onClick={() => handleDeleteAlarmSound(key, index)}>Delete</button>
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
                        onChange={(e) => handleInputChange(e, 'alarmTime')}
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
                        onChange={(e) => handleInputChange(e, 'alarmVolume')}
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
