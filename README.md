# log_notify

# todo
- mongo.update 是异步执行的，如果报错同时发生，相同 key 的报错也会被当做两条，改成同步执行 mongo.update
- 做一个网页查看所有报错，按时间筛选，按次数排序，每个报错列举可能的责任人，责任人自己标识是否处理，按未处理跟已处理筛选
