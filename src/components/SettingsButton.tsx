import React, { useState, ChangeEvent } from 'react';
import { TimerSettings } from '../TimerSettings';
import '../styles/SettingButton.css';
import '../styles/Dialog.css';
import '../styles/ControlButton.css';
import Dialog from './Dialog';
import { useSettings } from './SettingsContext';

const SettingButton = () => {
  const { settings, setSettings } = useSettings();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [notificationStartMessage, setNotificationStartMessage] = useState<string>(TimerSettings.NOTIFICATION_BREAK_START);
  const [notificationFinishMessage, setNotificationFinishMessage] = useState<string>(TimerSettings.NOTIFICATION_BREAK_FINISH);
  const [notificationDisplayTime, setNotificationDisplayTime] = useState<number>(TimerSettings.NOTIFICATION_DISPLAY_TIME);
  const [alarmSound, setAlarmSound] = useState<File | null>(null);
  const [alarmTime, setAlarmTime] = useState<number>(20);
  const [alarmVolume, setAlarmVolume] = useState<number>(0.5);
  const [selectedSettingItem, setSelectedSettingItem] = useState<string>('notification');
  const [repeatNumber, setRepeatNumber] = useState(10);

  // Notification start message
  const handleNotificationStartMessage = (e: ChangeEvent<HTMLInputElement>) => {
    const newNotificationMessage = e.target.value;
    setNotificationStartMessage(newNotificationMessage);
    setSettings({
      ...settings,
      notificationStartMessage: newNotificationMessage,
    });
  };

  // Notification finish message
  const handleNotificationFinishMessage = (e: ChangeEvent<HTMLInputElement>) => {
    const newNotificationMessage = e.target.value;
    setNotificationFinishMessage(newNotificationMessage);
    setSettings({
      ...settings,
      notificationFinishMessage: newNotificationMessage,
    });
  };

  // Notification display time
  const handleNotificationDisplayTime = (e: ChangeEvent<HTMLInputElement>) => {
    const newNotificationDisplayTime = parseInt(e.target.value) * 1000;
    setNotificationDisplayTime(newNotificationDisplayTime);
    setSettings({
      ...settings,
      notificationDisplayTime: newNotificationDisplayTime,
    });
  };

  // Alarm sound
  const handleAlarmSound = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log(files[0]);
      setAlarmSound(files[0]);
    }
  };

  // Alarm time
  const handleAlarmTime = (e: ChangeEvent<HTMLInputElement>) => {
    const newAlarmTime = parseInt(e.target.value);
    setAlarmTime(parseInt(e.target.value));
    setSettings({
      ...settings, //
      alarmTime: newAlarmTime,
    });
  };

  // Alarm volume
  const handleAlarmVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const newAlarmVolume = parseFloat(e.target.value);
    setAlarmVolume(newAlarmVolume);
    setSettings({
      ...settings,
      alarmVolume: newAlarmVolume,
    });
  };

  const handleRepeatNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const newRepeatNumber = parseInt(e.target.value);
    setRepeatNumber(newRepeatNumber);
    setSettings({
      ...settings, //
      repeatNumber: newRepeatNumber,
    });
  };

  return (
    <>
      <div className="control-button setting-button" onClick={() => setDialogOpen(true)}>
        <i className={`fa fa-2x fa-gear`}></i>
      </div>
      <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} title="20-20-20 Rule" dialogClassName="settings">
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
                      value={notificationStartMessage}
                      onChange={handleNotificationStartMessage}
                    />
                  </div>

                  <div className="settings-item">
                    <label htmlFor="notificationMessage">終了時</label>
                    <input
                      type="text" //
                      id="notificationMessage"
                      value={notificationFinishMessage}
                      onChange={handleNotificationFinishMessage}
                    />
                  </div>

                  <div className="settings-item">
                    <label htmlFor="notificationDisplayTime">表示時間</label>
                    <input
                      type="number" //
                      id="notificationDisplayTime"
                      value={notificationDisplayTime / 1000}
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
                    <input type="file" id="alarmSound" accept="audio/*" onChange={handleAlarmSound} />
                  </div>
                  <div className="settings-item">
                    <label htmlFor="alarmTime">アラーム時間</label>
                    <input
                      type="number" //
                      id="alarmTime"
                      value={alarmTime}
                      onChange={handleAlarmTime}
                      max={20}
                      min={1}
                    />
                  </div>
                  <div className="settings-item">
                    <label htmlFor="alarmVolume">音量</label>
                    {/* <input type="number" id="alarmVolume" value={alarmVolume} onChange={handleAlarmVolume} /> */}
                    <input
                      type="number" //
                      id="alarmVolume"
                      value={alarmVolume}
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
                    <label htmlFor="repeatNumber">繰り返し回数</label>
                    <input
                      type="number" //
                      id="repeatNumber"
                      value={repeatNumber}
                      onChange={handleRepeatNumber}
                      max={99}
                      min={1}
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
