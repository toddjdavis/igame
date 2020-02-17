select * from messages
where chatroom_id = $1
order by message_id desc;