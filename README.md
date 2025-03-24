# `open-vote`

◇ サービスコンセプト
OpenVoteは、完全ブロックチェーン上で動く投票プラットフォームです。すべての投票データはブロックチェーンに記録され、誰でもその結果を検証できるため、透明性と信頼性が確保された投票システムを実現します。シンプルなUIにすることで、ユーザーは簡単に投票を作成・参加することができます。

◇ 利用ユーザ想定（ターゲット）
団体・団体活動：NGO、非営利団体、地域コミュニティでの投票
イベント主催者：イベントの投票やコンテスト、参加者からのフィードバック収集
個人ユーザー：趣味や興味のあるトピックに対する自由な投票

◇ メリットや特徴
改ざん不可能：ブロックチェーン技術により、投票結果の改ざんを防ぎます。
透明性：誰でも投票結果を確認できます。
簡単な使用感：ユーザーフレンドリーなインターフェースで、誰でも簡単に投票を作成・参加できます。
分散型：中央集権的な管理者がいないため、システム全体が公正で信頼性も高いです。

◇ ICPの仕組みをどの部分で使っているか
OpenVoteは、バックエンドもフロントエンドもすべてICPのcanister上で動いています。
また、投票の結果などはログイン不要で誰でも閲覧できますが、質問の作成や投票には Internet Identity でのログインが必要です。

◇ なぜICPの仕組みを活用して開発したか、その優位性や理由
ICPを選んだ理由は以下の点にあります：
スケーラビリティとパフォーマンス：ICPは非常に高いスケーラビリティを持ち、大量のリクエストにも耐えられるため、大規模な投票システムに向いています。
分散型アーキテクチャ：ICPの分散型の仕組みを活用することで、中央集権的な管理者なしで、フロントエンドとバックエンドのソースコードを含む全てのデータとプロセスが公正に運営されます。これにより、投票に大事な信頼性と透明性が保証されます。
低コスト：他のブロックチェーン等をを使う場合に比べICPはデータの書き込みコストなどが低いです。
セキュリティ：Internet Identity によるログイン機能を設けることで、無作為な投票を抑えつつ、アカウント発行やログインの煩わしさを最小限に抑えています。

◇ 開発進捗中の場合、現在どこまでできていて、今後どうしたいのかを記載してください
現在存在する機能
・Internet Identity によるログイン
・投票の一覧表示と並び替え
・投票の作成
・投票（1つの質問について1票投票可能）
・投票状況/結果の表示
・自身が作成した質問を表示
・自身が投票した質問を表示
・X, Telegramへの共有

今後の開発予定
・自動採番される投票IDが現在はナノセカンド単位のtimestampとなっていますが、これをUUIDに変更します。（UUID関連のエラーを解消する時間がなかったため暫定的にtimestampとしました。）
・スマホでのログイン（iPhone12 で試したところInternet Identityでのログインになぜか失敗するため修正します。）
・投票の検索機能
・多様な投票形式への対応（複数投票など）
・投票結果に関する高度な分析
・独自トークンによる賭け機能（勝者には限定NFTが付与されるなど）
・利用者からの課金の仕組み（管理者不在での継続的なサービス運営のため）