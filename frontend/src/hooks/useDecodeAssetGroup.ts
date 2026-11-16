import { useEffect } from "react";
import { decodeAssetGroup, type AssetGroupName } from "@/utils/preload";

export const useDecodeAssetGroup = (group: AssetGroupName) => {
  useEffect(() => {
    void decodeAssetGroup(group);
  }, [group]);
};
