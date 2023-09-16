import React, { useState } from 'react';
import Dialog from './Dialog';
import { RuleList, RuleListItem, Description, ControlButton, InfoButtonStyled } from '../styles/InfoButtonStyledComponents';

const InfoButton = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <ControlButton className="info-button" onClick={() => setDialogOpen(true)}>
        <i className={`fa fa-2x fa-info-circle`}></i>
      </ControlButton>
      <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} title="20-20-20 Rule" dialogClassName="information">
        <>
          <Description>The 20-20-20 rule is a simple guideline to reduce eye strain when using screens, such as computers or smartphones:</Description>
          <RuleList>
            <RuleListItem>Every 20 minutes</RuleListItem>
            <RuleListItem>Look at something 20 feet away</RuleListItem>
            <RuleListItem>For at least 20 seconds</RuleListItem>
          </RuleList>
          <Description>In essence, it's a reminder to take regular short breaks and focus on distant objects to give your eyes a rest when using screens for extended periods.</Description>
        </>
      </Dialog>
    </>
  );
};

export default InfoButton;
