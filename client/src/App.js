import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";

function App() {
  const [data, setData] = useState([]);
  const [keywords, setkeyword] = useState("");
  const [iserror, setError] = useState(null);
  const [isloading, setLoading] = useState(null);
  const [isdescription, setIsDescription] = useState(true);
  //const [isindex, setIsindex] = useState(false);

  const getData = async (e) => {
    try {
      setError(false);
      setLoading(true);
      const result = await axios.get(
        `http://localhost:4001/trips?keywords=${e}`
      );
      setData(result.data.data);
      setLoading(false);
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    getData("");
  }, []);

  const getKeyword = (e) => {
    setkeyword(e);
    getData(keywords);
  };

  // console.log(
  //   data.map((value, index) => {
  //     return value;
  //   })
  // );

  // console.log(keywords);

  function shearlink(e) {
    navigator.clipboard.writeText(e);
  }

  function deleteTag() {
    getData("");
    setkeyword("");
  }

  function getDescription(e) {
    setIsDescription(!isdescription);
    console.log("click!!");
  }

  console.log(data.map((value, index) => index));

  return (
    <div className="App flex flex-col items-center justify-center   ">
      <div className="input-section">
        <div className="logo ">
          <h1 className="text-sky-600 text-[60px] text-center">เที่ยวไหนดี</h1>
        </div>
        <div className="form">
          <form>
            <label htmlFor="name">
              <p className="text-xl">ค้นหาที่เที่ยว</p>
              <input
                className="border-2 border-gray-300 px-[300px] text-center h-[40px] text-[20px] "
                type="text"
                onChange={(e) => {
                  debounce(getData(e.target.value), 500);
                }}
                placeholder="หาที่เที่ยวแล้วไปกัน ..."
              />
            </label>
          </form>
          {keywords ? (
            <p className="bg-gray-400 p-1 rounded-full text-center mt-3 text-zinc-100 text-[20px] flex flex-row items-center justify-center w-[180px]">
              {keywords}
              <button
                className="ml-3 rounded-full bg-red-500 w-[30px]  text-center text-gray-100"
                onClick={() => {
                  deleteTag();
                }}
              >
                x
              </button>
            </p>
          ) : null}
        </div>
      </div>
      <div className="board flex flex-col items-center justify-center">
        {data.map((value, index) => {
          return (
            <div
              className="suggestion flex flex-row mt-[70px] p-5  "
              key={index}
            >
              <div className="photo-1">
                <img
                  src={value.photos[0]}
                  alt={value.title}
                  className="rounded-xl w-[300px] h-[200px] mr-7"
                ></img>
              </div>

              <div className="right-section w-[800px]">
                <a href={value.url}>
                  <h1 className="text-[30px] hover:text-slate-300 rounded-full  text-start">
                    {value.title}
                  </h1>
                </a>
                <div className="descriptions">
                  {isdescription ? (
                    <p className="text-gray-400">
                      {" "}
                      {value.description.slice(0, 160)} . . .{" "}
                    </p>
                  ) : null}

                  {/* <a href={value.url}>
                  <p className="text-sky-500  hover:text-sky-800 mb-5">
                    อ่านต่อ . .
                  </p>
                </a> */}
                  {isdescription ? (
                    <button
                      className="text-sky-500  hover:text-sky-800 mb-5"
                      onClick={() => getDescription(index)}
                    >
                      อ่านต่อ...
                    </button>
                  ) : null}
                  {isdescription ? null : (
                    <p className="text-gray-400">
                      {value.description.slice(0, Infinity)}
                    </p>
                  )}
                  {isdescription ? null : (
                    <button
                      className="text-sky-500  hover:text-sky-800 mb-5"
                      onClick={() => getDescription(index)}
                    >
                      น้อยลง...
                    </button>
                  )}
                </div>

                <div className=" mb-[10px]">
                  <span>หมวด</span>
                  <span>
                    {value.tags.map((value) => {
                      return value !== value[-1] ? (
                        <button
                          className="m-1 bg-blue-300 p-2 rounded-full hover:bg-blue-600"
                          onClick={() => getKeyword(value)}
                        >
                          {value}
                        </button>
                      ) : (
                        <div>
                          <span>
                            และ
                            <button
                              className="m-1 bg-blue-300 p-2 rounded-full"
                              onClick={() => getKeyword(value)}
                            >
                              {value}
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </span>
                </div>
                <div className="flex flex-row items-end justify-end">
                  <button
                    className="hover:bg-slate-400 rounded-full p-3"
                    onClick={() => shearlink(value.url)}
                  >
                    Copy link
                  </button>
                </div>

                <div className="picture flex flex-row" key={index}>
                  <img
                    src={value.photos[1]}
                    alt={value.title}
                    className="rounded-xl w-[150px] h-[100px] mr-7"
                  ></img>
                  <img
                    src={value.photos[2]}
                    alt={value.title}
                    className="rounded-xl w-[150px] h-[100px] mr-7"
                  ></img>
                  <img
                    src={value.photos[3]}
                    alt={value.title}
                    className="rounded-xl w-[150px] h-[100px] mr-7"
                  ></img>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {iserror ? <h1>Request Fail</h1> : null}
      {isloading ? <h1>Loading ... </h1> : null}
    </div>
  );
}

export default App;
