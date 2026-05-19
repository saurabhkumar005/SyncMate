const [message, setMessage] = useState("");
  useEffect(()=>{
    socket.on("mess",(data)=>{
      console.log("Frontend: message Recieved", data);
    });

    return ()=>{
      console.log("socket turning off", socket.id);
      socket.off("mess");
    }
  },[]);
  const sendMessage = ()=>{
    socket.emit("msg",message);
    setMessage("");
  }
  return (
    <>
    <h1> Chat APP</h1>
    <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)}/>
    <button onClick={sendMessage}>Send Message</button>
    </>
  )