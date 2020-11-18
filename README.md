# まいにち語部
にじさんじ所属ライバー「語部紡」の過去のツイートを3時と15時に指定されたDiscordチャンネルに送信するBOTです。  
送信されるツイートはランダムで、リツイートや引用ツイートは含まれません。  

## 運用方法
DiscordとTwitterのAPIを使用しているため、以下の5つの環境変数を設定する必要があります。  

- DISCORD_TOKEN
- TWITTER_CONSUMER_KEY
- TWITTER_CONSUMER_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_TOKEN_SECRET

Docker Composeを使用してるため、そのまま`docker-compose up`でBOTが起動します。  
