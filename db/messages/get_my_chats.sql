select u.email, u.user_id, u.user_picture from users u
join chat_junc cj on u.user_id = cj.user_id
join chatrooms cr on cr.chatroom_id = cj.chatroom_id
where cj.chatroom_id in (select chatroom_id from chat_junc where user_id = $1) and u.user_id != $1 