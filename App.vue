<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 判断有没有存储权限
    var _this = this
    plus.android.requestPermissions(
      ['android.permission.WRITE_EXTERNAL_STORAGE'],
      function (e) {
        console.log(e.deniedPresent)
        if (e.deniedAlways.length > 0) {
          //权限被永久拒绝
          // 弹出提示框解释为何需要读写手机储存权限，引导用户打开设置页面开启
          uni.showModal({
            title: '存储权限',
            content: '您拒绝了存储权限，请去设置-应用开启存储权限。',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定');
              } else if (res.cancel) {
                // console.log('用户点击取消');
              }
            }
          })
        }
        if (e.deniedPresent.length > 0) {
          //权限被临时拒绝
          // 弹出提示框解释为何需要读写手机储存权限，可再次调用plus.android.requestPermissions申请权限
          plus.android.requestPermissions(['android.permission.WRITE_EXTERNAL_STORAGE'])
          // console.log('666666666 ' + e.deniedPresent.toString());
        }
        if (e.granted.length > 0) {
          //权限被允许
          //调用依赖获取读写手机储存权限的代码
          // _this.upload() // 获取权限成功之后调用的函数
          // console.log('2222222222 ' + e.granted.toString());
          if (!sqlite.isOpen()) {
            sqlite.openDb().then(res => {
              SysBoxDetail.init()
              // ......
            })
          }
        }
      },
      function (e) {
        // console.log('R12133313221' + JSON.stringify(e));
      }
    )
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-plus/index.scss';
</style>
