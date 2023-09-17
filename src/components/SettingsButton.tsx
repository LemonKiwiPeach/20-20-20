import React, { useState, useEffect, ChangeEvent } from 'react';
import Dialog from './Dialog';
import { useSettings, Settings } from './SettingsContext';
import { fetchAllKeysFromAudioStore, deleteAudioFromIndexedDB, upsertAudioToIndexedDB } from './dbUtils';
import {
  SettingsWrapper, //
  Aside,
  Section,
  SettingsContainer,
  SettingsRow,
  SettingsContent,
  SettingsSection,
  Input,
  Label,
  CustomFileUpload,
  DefaultFileUpload,
  ToggleButton,
  MessageBox,
  Caption,
} from '../styles/SettingButtonStyledComponents';
import { Button } from '../styles/ClockButtonStyledComponents';

const SettingButton = () => {
  const { settings, setSettings } = useSettings();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSettingItem, setSelectedSettingItem] = useState<string>('notification');
  const [isMessageBoxVisible, setMessageBoxVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [prevSettings, setPrevSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchAlarmSounds = async () => {
      // Todo: This is called before the "audio" objectstore is created.
      const initialAlarmSounds = await fetchAllKeysFromAudioStore();
      updateSettings('alarmSounds', initialAlarmSounds);
    };

    fetchAlarmSounds();
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      setPrevSettings(settings);
    } else {
      if (JSON.stringify(prevSettings) !== JSON.stringify(settings)) {
        showMessageBox();
      }
      setPrevSettings(settings);
    }
  }, [settings]);

  const showMessageBox = () => {
    setMessageBoxVisible(true);
    setTimeout(() => {
      setMessageBoxVisible(false);
    }, 3000);
  };

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
      {isMessageBoxVisible && <MessageBox className={isMessageBoxVisible ? 'show' : ''}>Settings have been changed.</MessageBox>}
      <i className={`fa fa-2x fa-gear`} onClick={() => setDialogOpen(true)}></i>
      {isDialogOpen && (
        <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} title="Settings" dialogClassName="settings">
          <>
            <SettingsContainer>
              <Aside>
                <SettingsSection
                  className={selectedSettingItem === 'notification' ? 'selected' : ''} //
                  onClick={() => setSelectedSettingItem('notification')}
                >
                  Notification
                </SettingsSection>
                <SettingsSection
                  className={selectedSettingItem === 'alarm' ? 'selected' : ''} //
                  onClick={() => setSelectedSettingItem('alarm')}
                >
                  Alarm
                </SettingsSection>
                <SettingsSection
                  className={selectedSettingItem === 'others' ? 'selected' : ''} //
                  onClick={() => setSelectedSettingItem('others')}
                >
                  Others
                </SettingsSection>
              </Aside>
              <Section>
                {selectedSettingItem === 'notification' && (
                  <>
                    <SettingsWrapper className="notification-message">
                      <Label>Notification messages</Label>
                      <SettingsRow>
                        <Label htmlFor="notificationStartMessage">At alarm start</Label>
                        <Input type="text" id="notificationStartMessage" value={settings.notificationStartMessage} onChange={(e) => handleInputChange(e, 'notificationStartMessage')} />
                      </SettingsRow>

                      <SettingsRow>
                        <Label htmlFor="notificationFinishMessage">At alarm end</Label>
                        <Input
                          type="text" //
                          id="notificationFinishMessage"
                          value={settings.notificationFinishMessage}
                          onChange={(e) => handleInputChange(e, 'notificationFinishMessage')}
                        />
                      </SettingsRow>
                    </SettingsWrapper>

                    <SettingsWrapper>
                      <SettingsRow>
                        <Label htmlFor="notificationDisplayTime">Display time (seconds)</Label>
                        <Input
                          type="number" //
                          id="notificationDisplayTime"
                          value={settings.notificationDisplayTime / 1000}
                          onChange={(e) => handleInputChange(e, 'notificationDisplayTime', 1000)}
                        />
                      </SettingsRow>
                    </SettingsWrapper>
                  </>
                )}

                {selectedSettingItem === 'alarm' && (
                  <>
                    <SettingsWrapper>
                      <SettingsRow>
                        <Label htmlFor="alarmSound">Alarm sound</Label>
                        <CustomFileUpload htmlFor="alarmSound">Upload File</CustomFileUpload>
                        <DefaultFileUpload
                          type="file" //
                          id="alarmSound"
                          accept="audio/*"
                          onChange={handleUploadingAlarmSound}
                        />
                      </SettingsRow>

                      {settings.alarmSounds.map((key, index) => (
                        <SettingsRow key={index}>
                          <input
                            type="radio" //
                            id={key}
                            name="settings-radio-group"
                            checked={settings.alarmSound === key}
                            onChange={() => handleRadioChange(key)}
                          />
                          <SettingsContent htmlFor={key}>{key}</SettingsContent>
                          <Button onClick={() => handleDeleteAlarmSound(key, index)}>Delete</Button>
                        </SettingsRow>
                      ))}

                      <Caption>
                        Sound from{' '}
                        <a href="https://www.zapsplat.com" target="_blank" rel="noopener noreferrer">
                          Zapsplat.com
                        </a>
                      </Caption>
                    </SettingsWrapper>

                    <SettingsWrapper>
                      <SettingsRow>
                        <Label htmlFor="alarmTime">Alarm time (seconds)</Label>
                        <Input
                          type="number" //
                          id="alarmTime"
                          value={settings.alarmTime}
                          onChange={(e) => handleInputChange(e, 'alarmTime')}
                          max={20}
                          min={1}
                        />
                      </SettingsRow>
                    </SettingsWrapper>

                    <SettingsWrapper>
                      <SettingsRow>
                        <Label htmlFor="alarmVolume">Volume</Label>
                        <Input
                          type="number" //
                          id="alarmVolume"
                          value={settings.alarmVolume}
                          onChange={(e) => handleInputChange(e, 'alarmVolume')}
                          step="0.1"
                          max="1"
                          min="0"
                        />
                      </SettingsRow>
                    </SettingsWrapper>
                  </>
                )}

                {selectedSettingItem === 'others' && (
                  <>
                    <SettingsWrapper>
                      <SettingsRow>
                        <Label htmlFor="repeatToggle">Repeat mode</Label>
                        <ToggleButton className={settings.isContinuous ? 'active' : ''} id="repeatToggle" onClick={handleRepeatToggle}>
                          {settings.isContinuous ? 'ON' : 'OFF'}
                        </ToggleButton>
                      </SettingsRow>
                    </SettingsWrapper>
                  </>
                )}
              </Section>
            </SettingsContainer>
          </>
        </Dialog>
      )}
    </>
  );
};

export default SettingButton;
