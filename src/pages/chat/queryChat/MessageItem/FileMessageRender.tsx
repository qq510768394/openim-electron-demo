import { MessageStatus, MessageType } from "@openim/wasm-client-sdk";
import { useDrag } from "ahooks";
import { Image, Spin ,Card } from "antd";
import { FC } from "react";
import fileIcon from "@/assets/images/messageItem/file_icon.png";
import downloadIcon from "@/assets/images/messageItem/file_download.png";
import { useVideoPlayer } from "@/pages/common/VideoPlayerModal";
import FileDownloadIcon from "@/svg/FileDownloadIcon";
import { secondsToMS } from "@/utils/common";

import { IMessageItemProps } from ".";
const { Meta } = Card;

const min = (a: number, b: number) => (a > b ? b : a);

const   getFileSize = (size:number)=> {
    if (size < 1024) {
        return `${size}B`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)}KB`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)}MB`;
    } else {
        return `${(size / (1024 * 1024 ))}GB`};
}
const FileMessageRender: FC<IMessageItemProps> = ({ message }) => {
  console.info("正在渲染file文件");
  // console.log(message)

  const sourceUrl=  message.fileElem.sourceUrl;
  const fileName = message.fileElem.fileName
  const fileSize = getFileSize(message.fileElem.fileSize);
  const isSending = message.status === MessageStatus.Sending;
  return (
    <Spin spinning={isSending}>
        <div style={{width:240, padding:10,border:'1px solid rgba(0,0,0,0.1)', borderRadius:5,  display:"flex",alignItems:"center",justifyContent:'space-between'}}>
            <div>
                <div style={{fontWeight:600,marginBottom:5}}>{fileName}</div>
                <div>{fileSize}</div>
            </div>
            <div>
                <a href={sourceUrl} style={{position:"relative"}}>
                    <img style={{width: 50 ,height :50}} src={fileIcon}></img>
                    <div style={{position:'absolute',left:0,right:0,top:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <img style={{width:30,height:30}} src={downloadIcon}></img>
                    </div>

                </a>
            </div>
        </div>
    </Spin>
  );
};

export default FileMessageRender;
