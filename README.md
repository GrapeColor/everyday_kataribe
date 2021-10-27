# まいにち語部
毎日指定されたチャンネルに[語部紡のツイート](https://twitter.com/KataribeTsumugu)をランダムにピックアップして送信する、Discord用のBOTです。  
送信されるツイートはランダムで、リツイートや引用ツイートは含まれません。  
ツイートを送信するチャンネルの指定は、チャンネルのトピックに`<まいにち語部>`の文字列を含ませるだけです。
また、このBOTの発言権があるチャンネルで、このBOTのユーザーメンション単独のメッセージを送信することでも、ツイートを送信させることができます。  

## 運用方法
あらかじめDiscordとTwitterのTOKENを取得しておく必要があります。  
Dockerコンテナ作成時に、以下の環境変数の指定が必要になります。  
  
`EVERYDAY_KATARIBE_TOKEN` はDiscordのBOTトークンです。  
`TWITTER_BEARER_TOKEN` はTwitterのBearerトークンです。  
`RANDOM_POST_TWEET_SCHEDULE` は指定チャンネルにツイートを送信するスケジュールです。詳しくは[こちら](https://github.com/node-cron/node-cron#cron-syntax)をご覧ください。  
`ACTIVITY_STREAMING_NAME` はBOTのステータスに表示する文字列です。  
`ACTIVITY_STREAMING_URL` はBOTのステータスに表示するYouTubeかTwitchのURLです。  
