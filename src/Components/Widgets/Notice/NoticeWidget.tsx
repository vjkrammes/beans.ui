import { useState} from "react";
import {MdDelete, MdCheck, MdCancel} from "react-icons/md";
import {FaPlus, FaMinus} from "react-icons/fa";
import {INoticeModel} from "../../../Interfaces/INoticeModel";
import "./NoticeWidget.css";

type Props = {
  notice: INoticeModel;
  readHandler: (notice: INoticeModel) => void,
  delHandler: (notice: INoticeModel) => void
};

export default function NoticeWidget({notice, readHandler, delHandler}: Props) {
  const [showText, setShowText] = useState<boolean>(false);
  function getSender(): string {
    if (!notice) {
      return "Unknown";
    }
    if (notice.senderIsExchange) {
      return "Exchange";
    }
    if (notice.senderIsSystem) {
      return "System";
    }
    if (!notice.sender) {
      return "Unknown";
    }
    return notice.sender.displayName;
  }
  function expandClick() {
    const oldsetting = showText;
    setShowText(!showText);
    if (!oldsetting && !notice.read) {
      readHandler(notice);
    }
  }
  function deleteClicked() {
    delHandler(notice);
  }
  return (
    <div className={"notw__body"}>
      <div
        className={"notw__date"}>{new Date(notice.noticeDate).toISOString().split('T')[0]}</div>
      <div className={"notw__sender"}>{getSender()}</div>
      <div className={"notw__readindicator"}>{notice.read 
        ? <MdCheck title={"Notice has been read"} /> 
        : <MdCancel title={"Notice has not been read"} />}</div>
      <div className={"notw__buttons"}>
        <button className={"squarebutton"} onClick={expandClick}>
        <span>
          {showText && <FaMinus/>}
          {!showText && <FaPlus/>}
        </span>
        </button>
        {notice.read && (
          <button className={"squarebutton dangerbutton"} type={"button"} onClick={deleteClicked}>
            <span>
              <MdDelete/>
            </span>
          </button>
        )}
      </div>
      <div className={"notw__title"}>{notice.title}</div>
      {showText && <div className={"notw__text"}>{notice.text}</div>}
    </div>
  );
}