import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShow] = useState(false);
  const [friends, setfriends] = useState(initialFriends);
  const [selectfriend, setselectfriend] = useState(null);

  function handelShowAddFriend() {
    setShow((show) => !show);
  }

  function handeladdfriend(friend) {
    setfriends((friends) => [...friends, friend]);
    setShow(false);
  }
  function handeselectfriend(friend) {
    //setselectfriend(friend);
    setselectfriend((cur) => (cur?.id === friend.id ? null : friend));
    setShow(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelect={handeselectfriend}
          selectedfriend={selectfriend}
        />
        {showAddFriend && <FormAddFriend onAddfriend={handeladdfriend} />}
        <Button onclick={handelShowAddFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectfriend && <FormSplitBill selectedfriend={selectfriend} />}
    </div>
  );
}

function FriendsList({ friends, onSelect, selectedfriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedfriend={selectedfriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedfriend }) {
  const isSelected = selectedfriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onclick={() => onSelect(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddfriend }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");
  function handelsubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID;
    const newfriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddfriend(newfriend);
    setname("");
    setimage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handelsubmit}>
      <label>😊Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedfriend }) {
  const [bill, setbill] = useState("");
  const [paidbyuser, setpaidbyuser] = useState("");
  const paidbyfriend = bill ? bill - paidbyuser : "";
  const [whoispaying, setwhoispaying] = useState("user");
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedfriend.name}</h2>

      <label>💸Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />
      <label>💵Your expense</label>
      <input
        type="text"
        value={paidbyuser}
        onChange={(e) =>
          setpaidbyuser(
            Number(e.target.value) > bill ? paidbyuser : Number(e.target.value)
          )
        }
      />
      <label>🧍{selectedfriend.name} expense</label>
      <input type="text" disabled value={paidbyfriend} />
      <label>🧐Who is paying ?🧐</label>
      <select value={whoispaying} onChange={setwhoispaying}>
        <option value="user">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}
