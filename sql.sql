create table User(
    user_id varchar(255) primary key,
    user_pw varchar(255) not null
);

insert into User values('sangyeob', '0429');

create table User_follow(

    user_id varchar(255),
    following_id varchar(255),
    foreign key(user_id) references User(user_id),
    foreign key(following_id) references User(user_id),
    primary key(user_id, following_id)
)

insert into User_follow values('sagnyeob', 'hyejin');


create table Topic(
    topic_id int AUTO_INCREMENT primary key,
    title varchar(255),
    regdata TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endtime TIMESTAMP
)

create table Post(
    post_id int AUTO_INCREMENT primary key,
    topic_id int,
    user_id varchar(255),
    content varchar(255),
    mediaURL varchar(255),
    likes int,
    comments int,
    regdata TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key(user_id) references User(user_id),
    foreign key(topic_id) references Topic(topic_id)
);

create table Comment(
    comment_id int AUTO_INCREMENT primary key,
    writer_id  varchar(255),
    post_id int, 
    content varchar(255),
    regdata TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
    foreign key(writer_id) references User(user_id),
    foreign key(post_id) references Post(post_id)
);

create table Untopic_like(
    untopic_id  int AUTO_INCREMENT primary key,
    user_id varchar(255),
    regdata TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key(untopic_id) references Untopic(untopic_id)
    foreign key(user_id) references User(user_id)
)

insert into Post(null, )

create table 