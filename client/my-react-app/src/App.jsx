
function App() {
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form Submitted!");
  // };


  return (
    <>
     <div className="login">
     <form >
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
     </div>
    </>
  )
}

export default App
