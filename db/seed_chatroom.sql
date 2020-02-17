create table chatrooms (
    chatroom_id serial primary key
);
create table chat_junc (
    chat_junc_id serial primary key,
    chatroom_id int REFERENCES chatrooms(chatroom_id),
    user_id int REFERENCES users(user_id)
);

create table messages (
    message_id serial primary key,
    chatroom_id int REFERENCES chatrooms(chatroom_id),
    user_id int REFERENCES users(user_id),
    message varchar(500),
    email varchar(250) 
)