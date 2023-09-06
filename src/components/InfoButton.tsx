import React, { useState } from "react";
import "../styles/Dialog.css";
import "../styles/ControlButton.css";
import "../styles/InfoButton.css";
import Dialog from "./Dialog";

const InfoButton = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="control-button info-button" onClick={() => setDialogOpen(true)}>
        <i className={`fa fa-2x fa-info-circle`}></i>
      </div>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        title="20-20-20 Rule"
        dialogClassName="information"
      >
        <>
          <p>
            The 20-20-20 rule is a simple guideline to reduce eye strain when using screens, such as
            computers or smartphones:
          </p>
          <ul>
            <li>Every 20 minutes</li>
            <li>Look at something 20 feet away</li>
            <li>For at least 20 seconds</li>
          </ul>
          <p>
            In essence, it's a reminder to take regular short breaks and focus on distant objects to
            give your eyes a rest when using screens for extended periods.
          </p>
        </>
      </Dialog>
    </>
  );
};

export default InfoButton;
