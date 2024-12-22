export enum ManifestFileProcess {
  // 等待上传
  PENDING = 'pending',

  // 上传中
  UPLOADING = 'uploading',

  // 上传成功
  SUCCESS = 'success',

  // 上传失败
  FAIL = 'fail',
}
