const users = [];

const addUser = ({ id, name, room }) => {
  // Clean the data
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate Data
  if (!name || !room) {
    return {
      error: "Username and room are required."
    };
  }

  // makesure name is unique
  const existingUser = users.find(user => {
    return user.room === room && user.username === name;
  });
  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use."
    };
  }

  // Store user
  const user = { id, username: name, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  return users.find(user => user.id === id);
};

const getUserInRoom = room => {
  return users.filter(user => user.room === room);
};

const getUsers = () => {
  return users;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
  getUsers
};
