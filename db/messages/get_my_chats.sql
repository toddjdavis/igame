select * from chat_junc cj
join users u on u.user_id = cj.user_id
where cj.user_id = $1