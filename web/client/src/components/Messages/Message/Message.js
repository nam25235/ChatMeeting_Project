import React from "react";

import "./Message.css";

import ReactEmoji from "react-emoji";

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();
  let isSentByBot = user === "BOT" ? true : false;

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundCurrentUserColor">
        <p className="messageText fontCurrentUserColor">
          {ReactEmoji.emojify(text)}
        </p>
      </div>
    </div>
  ) : isSentByBot ? (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundBotColor">
        <p className="messageText fontBotColor">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundOtherColor">
        <p className="messageText fontOtherUserColor">
          {ReactEmoji.emojify(text)}
        </p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default Message;
