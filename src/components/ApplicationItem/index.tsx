import { Button, Spin } from "antd";
import { t } from "i18next";
import { ApplicationHandleResult } from "open-im-sdk-wasm";
import {
  FriendApplicationItem,
  GroupApplicationItem,
} from "open-im-sdk-wasm/lib/types/entity";
import { memo, useState } from "react";

import arrow from "@/assets/images/contact/arrowTopRight.png";
import OIMAvatar from "@/components/OIMAvatar";

type ApplicationItemSource = FriendApplicationItem & GroupApplicationItem;

export type AccessFunction = (source: Partial<ApplicationItemSource>) => Promise<void>;

const ApplicationItem = ({
  currentUserID,
  source,
  onAccept,
  onReject,
}: {
  source: Partial<ApplicationItemSource>;
  currentUserID: string;
  onAccept: AccessFunction;
  onReject: AccessFunction;
}) => {
  const [loading, setLoading] = useState(false);
  const isRecv = source.userID !== currentUserID && source.fromUserID !== currentUserID;
  const isGroup = Boolean(source.groupID);
  const showActionBtn = source.handleResult === 0 && isRecv;

  const getApplicationDesc = () => {
    if (isGroup) {
      return `${isRecv ? "" : `${t("me")}：`}${t("application.applyToJoin")} `;
    }
    return `${isRecv ? "" : `${t("me")}：`}${t("application.applyToFriend")} `;
  };

  const getTitle = () => {
    if (isGroup) {
      return isRecv ? source.nickname : source.groupName;
    }
    return isRecv ? source.fromNickname : source.toNickname;
  };

  const getStatusStr = () => {
    if (source.handleResult === ApplicationHandleResult.Agree) {
      return t("application.agreed");
    }
    if (source.handleResult === ApplicationHandleResult.Reject) {
      return t("application.refused");
    }
    return t("application.pending");
  };

  const getAvatarUrl = () => {
    if (isGroup) {
      return isRecv ? source.userFaceURL : source.groupFaceURL;
    }
    return isRecv ? source.fromFaceURL : source.toFaceURL;
  };

  const loadingWrap = async (isAgree: boolean) => {
    setLoading(true);
    await (isAgree ? onAccept(source) : onReject(source));
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="flex flex-row items-center justify-between p-3.5 transition-colors hover:bg-[#f3f9ff]">
        <div className="flex flex-row">
          <OIMAvatar src={getAvatarUrl()} text={getTitle()} isgroup={isGroup} />
          <div className="ml-3">
            <p className="text-sm">{getTitle()}</p>
            <p className="pb-2.5 pt-[5px] text-xs ">
              {getApplicationDesc()}
              {isGroup && (
                <span className="text-xs text-[#0289FAFF]">{source.groupName}</span>
              )}
            </p>
            <p className="text-xs text-[#8E9AB0]">{t("application.information")}:</p>
            <p className="text-xs text-[#8E9AB0]">{source.reqMsg}</p>
          </div>
        </div>

        {showActionBtn && (
          <div className="flex flex-row">
            <div className="mr-5.5 h-8 w-[60px]">
              <Button
                block={true}
                size="small"
                onClick={() => loadingWrap(true)}
                className="!h-full !rounded-md border-2 border-[#0089FF] text-[#0089FF]"
              >
                {t("application.agree")}
              </Button>
            </div>
            <div className="h-8 w-[60px]">
              <Button
                block={true}
                size="small"
                type="primary"
                className="!h-full !rounded-md bg-[#0289fa]"
                onClick={() => loadingWrap(false)}
              >
                {t("application.refuse")}
              </Button>
            </div>
          </div>
        )}

        {!showActionBtn && (
          <div className="flex flex-row items-center">
            {!isRecv && <img className="mr-2 h-4 w-4" src={arrow} alt="" />}
            <p className="text-sm text-[#8E9AB0]">{getStatusStr()}</p>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default memo(ApplicationItem);
