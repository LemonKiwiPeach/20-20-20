import React, { useState } from "react";
import "../styles/InfoButton.css";
import "../styles/Dialog.css";
import "../styles/ControlButton.css";

const InfoButton = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="control-button info-button" onClick={() => setDialogOpen(true)}>
        <i className={`fa fa-2x fa-info-circle`}></i>
      </div>
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="close-button" onClick={() => setDialogOpen(false)}>
              ×
            </div>
            <h2>20-20-20 Rule</h2>
            <p>
              The 20-20-20 rule is a simple guideline to reduce eye strain when using screens, such
              as computers or smartphones:
            </p>
            <ul>
              <li>Every 20 minutes</li>
              <li>Look at something 20 feet away</li>
              <li>For at least 20 seconds</li>
            </ul>
            <p>
              In essence, it's a reminder to take regular short breaks and focus on distant objects
              to give your eyes a rest when using screens for extended periods.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoButton;
