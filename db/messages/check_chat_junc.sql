select cj.chatroom_id from chat_junc cj
join chat_junc cjj
on cjj.chatroom_id = cj.chatroom_id
where cj.user_id = $1
and cjj.user_id = $2;