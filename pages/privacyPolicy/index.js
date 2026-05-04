import { H5Url } from "../../config/index";

Page({
  data: {
    url: "",
  },

  onLoad() {
    this.setData({
      url: `${H5Url}/common/terms-of-agreement?agreementType=PRIVACY_POLICY`,
    });
  },
});
