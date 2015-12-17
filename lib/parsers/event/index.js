var $ = require('../../utils'),
    user = require('../../models/user'),
    alert = require('../../models/alert');

module.exports = function(data, echo) {
    var event = data.Event.toLowerCase();
    var userName = data.FromUserName;
    var key = data.EventKey;
    var keyMap = {
        getFull: '全天',
        getLunch: '午餐',
        getDinner: '晚餐',
        cancelLunch: '取消午餐',
        cancelDinner: '取消晚餐',
        getAlert: '订阅提醒',
        cancelAlert: '取消提醒',
        getList: '订餐查询',
        getHelp: '帮助'
    };
    switch(event) {
        case 'subscribe':
            var help = [];
            help.push('终于等到你，还好没放弃～～');
            help.push('你好，我就是传说中的段子手 Parker 💀');
            help.push('你可以通过语音或文字与我交流，例如：');
            help.push('“订饭”');
            help.push('“我要订餐”');
            help.push('“取消订餐”');
            help.push('“我不订饭了”');
            help.push('“订饭查询”');
            help.push('“订餐状态”');
            help.push('随便试试吧，我是在主人半睡半醒的时候开发出来的，难免有 bug，顺便给测测吧。 🙏');
            help.push('另外，为了避免每日提醒造成骚扰，你需要主动发送“订阅提醒”来开启提醒服务，发送“取消提醒”关闭提醒服务。');
            echo(help.join('\n'));
            break;
        case 'location':
            $.wechat.getUserInfo(userName, function(err, result) {
                user.sync(result, function(err, result) {
                    echo(null);
                });
            });
            break;
        case 'unsubscribe':
            alert.removeOne(userName, function(info) {
                console.log(info);
                echo(null);
            });
            break;
        case 'click':
            switch(key) {
                case 'getHelp':
                case 'getList':
                case 'getFull':
                case 'getLunch':
                case 'getDinner':
                case 'cancelLunch':
                case 'cancelDinner':
                    require('../../robots/eat')(userName, keyMap[key], echo);
                    break;
                case 'getAlert':
                case 'cancelAlert':
                    require('../../robots/alert')(userName, keyMap[key], echo);
                    break;
                default:
                    echo(null);
                    break;
            }
            break;
        default:
            echo(null);
            break;
    }
};
