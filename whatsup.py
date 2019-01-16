#coding=utf8
import requests
import json,time

# 获取百度token,有时效性，过期后再次获取
def get_baidu_token():
    c_id = '你的clientid'
    c_s = '你的百度secretkey'
    host = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&' \
           'client_id=' + c_id + '&client_secret=' + c_s
    header = {'Content-Type': 'application/json; charset=UTF-8'}
    request = requests.post(url=host, headers=header)
    response = request.json()
    baidu_token=response["access_token"]
    print(baidu_token)
    return baidu_token

def get_unit_res(msg,sid):
    #
    access_token = '上面获取到的token'
    url = 'https://aip.baidubce.com/rpc/2.0/unit/service/chat?access_token=' + access_token
    request={"query":msg,
             "user_id":"888888",
             }
    dialog_state={"contexts":{
        "SYS_REMEMBERED_SKILLS":["28301"]}}
    body={"log_id":"UNITTEST_10000",
          "version":"2.0",
          "service_id":"S12044",
          "session_id":sid,
          "request":request,
          "dialog_state":dialog_state
          }
    # body = "{\"log_id\":\"UNITTEST_10000\",\"version\":\"2.0\"," \
    #        "\"service_id\":\"S10000\",\"session_id\":\"\"," \
    #        "\"request\":{\"query\":\"你好\",\"user_id\":\"88888\"}," \
    #        "\"dialog_state\":{\"contexts\":{\"SYS_REMEMBERED_SKILLS\":[\"1057\"]}}}"
    body=json.dumps(body)
    heard={'Content-Type': 'application/json'}
    try:
        response = requests.post(url, headers=heard, data=body.encode('utf-8')).json()
        content = response["result"]["response_list"][0]['action_list'][0]['say']
        sid=response["result"]["session_id"]
        return content,sid
    except:
        return '百度unit不灵了',''


def get_response(msg):
    # 这里我们就像在“3. 实现最简单的与图灵机器人的交互”中做的一样
    # 构造了要发送给服务器的数据
    # KEY = '8edce3ce905a4c1dbb965e6b35c3834d' v1用key就可以，v2需要key加userid
    KEY = '你的图灵apikey'
    userId = '你的图灵用户id'
    apiUrl = 'http://openapi.tuling123.com/openapi/api/v2'
    qdata={
	"reqType":0,
    "perception": {
        "inputText": {
            "text": msg },
        "inputImage": {},
        "selfInfo": {
            "location": {
                "city": "北京",
                "province": "北京",
                "street": "信息路"
            }
        }
    },
    "userInfo": {
        "apiKey": KEY,
        "userId": userId
    }
    }
    body=json.dumps(qdata)

    try:
        r = requests.post(apiUrl, data=body).json()
        # 字典的get方法在字典没有'text'值的时候会返回None而不会抛出异常
        replymsg=r['results'][0]['values']['text']
        return replymsg
    # 为了防止服务器没有正常响应导致程序异常退出，这里用try-except捕获了异常
    # 如果服务器没能正常交互（返回非json或无法连接），那么就会进入下面的return
    except:
        return '图灵不灵了'

# 使用微信机器人交互

# 图灵和百度互聊
def chat(begin_msg):
    touser='filehelper'
    # 如果图灵Key出现问题，那么reply将会是None
    reply_baidu=begin_msg
    sessionid=''
    for i in range(1,50):
        time.sleep(1)
        reply_tuling = get_response(reply_baidu)
        print(i,"  图灵 说: "+reply_tuling)
        # 调用百度，增加sessionid，首次空，后续使用上一次的
        reply_baidu,sessionid = get_unit_res(reply_tuling,sessionid)
        print(i,"  百度 说: " + reply_baidu)


if __name__=="__main__":
    # test_itchat()
    # get_response("测试图灵")
    msg0="今天天气不错"
    print("0 :  " +msg0)
    chat(msg0)
    # get_unit_res('我猜不到你想表达的意思。')
