import {
  useState,
  useEffect,
  useEffectEvent,
  useRef,
  useId,
  useLayoutEffect,
  useMemo,
  useCallback,
  useReducer,
  useDeferredValue,
  useActionState,
  lazy,
  Suspense,
  useTransition,
  useOptimistic,
  act
} from "react";
import "./App.css";
import Btn from "./Btn";
import useTheme from "./useTheme";
import Modal from "./Modal";
import CatchErr from "./CatchErr";
import ErrorBoundry from "./ErrorBoundry";
import Show from "./Show";
import { email, password, min, useValidator, required } from "codpro-validator";
const LazyComponent = lazy(() => import("./LazyComponent"));

const App = () => {
  // useState hook
  const [count, setCount] = useState(0);
  const [inc, setInc] = useState(1);
  const [dis, setDis] = useState(0);
  const [measure, setMeasure] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [factorials, setFactorials] = useState(5);

  // useEffectEvent
  let storeFn = useEffectEvent(() => {
    setDis((pre) => pre + inc);
  });

  // useEffect hook
  useEffect(() => {
    let time = setInterval(() => {
      storeFn();
    }, 1000);

    return () => clearInterval(time); // cleanup fn when unmount the component
  }, [storeFn]); // if [] empty run once, if not this [] every render,[deps] it will re-render when change deps from previous

  //useId
  let uniqueId = useId(); // generate str :r0:, :r1:

  //useRef
  let divRef = useRef(null);
  let nameRef = useRef(null); //connect input with ref attr
  const focusRun = () => {
    nameRef.current.focus();
  };

  //useLayoutEffect run it before reprints the browser screen
  useLayoutEffect(() => {
    let rect = divRef.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.bottom });
  }, [measure]);

  const layout = () => {
    setMeasure((pre) => !pre);
  };

  //useMemo
  let result = useMemo(() => {
    function fac(n) {
      if (n === 0 || n === 1) return 1;
      return n * fac(n - 1);
    }
    return fac(factorials || 5); // always return c cache
  }, [factorials]);

  //useCallback && memo
  const showMe = useCallback(() => {
    alert("hello cs 👋");
    console.log("first time");
  }, []);

  // useReducer hook

  function reducer(state, action) {
    switch (action.type) {
      case "INC":
        return {
          ...state,
          count: state.count + action.payload,
        };
      case "DEC":
        return {
          ...state,
          count:
            state.count >= action.payload
              ? state.count - action.payload
              : state.count,
        };
      case "RESET":
        return {
          ...state,
          count: 0,
        };
      default:
        return {
          ...state
        }
    }
  }

  const [state, dispatch] = useReducer(reducer, { count: 0 });

  //createContext, useContext, custom hook
  let { isDark, changeTheme } = useTheme();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  //createPortal
  const [show, setShow] = useState(false);
  const changeShow = () => setShow(pre => !pre);

  //useDeferredValue 
  const [query, setQuery] = useState("");
  let def = useDeferredValue(query);
  let isPen = def !== query;
  let items = new Array(1000).fill("React");
  let filter = items.filter(ele => ele.toLowerCase() === def.toLowerCase())

  //custom library && useActionState
  const { register, handleSubmit, isSubmitting, values, errors } = useValidator({
    email: {
      rules: [required(), email()]
    },
    password: {
      rules: [required(), password()]
    }
  }, { mode: "onChange" })

  function actionReducer(pre, formState) {
    return { ...values }
  }
  const [stateData, formAction, isPending] = useActionState(actionReducer, {})

  // lazy loading
  const [render, setRender] = useState(false);

  // useTransition hook
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [fil, setFil] = useState([]);
  const [touched, setTouched] = useState(false)

  let numbers = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => i + 1)
  }, [])

  const handleClick = (e) => {
    let { value } = e.target;
    setSearch(value);
    startTransition(() => {
      setFil(numbers.filter(n => n.toString().includes(value.trim())))
    })
  }

  //useOptimistic hook
  const [optPending, startOptTransition] = useTransition();
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(2999);

  const [optState, callOptState] = useOptimistic(likes, (curr, val) => {
    return curr + val
  });
  async function LikePost() {
    let act = like ? -1 : 1;
    setLike(pre => !pre);
    callOptState(act)
    
    startOptTransition(async () => {
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("success data resolve");
        }, 3000);
      }).then((res) => console.log(res));
      setLikes(pre => pre + act)
    } catch {
      setLike(pre => !pre)
    }
  });
  }

  return (
    <>
      {/* useState hook use, useState */}
      <h1>useState hook</h1>
      <button onClick={() => setCount((pre) => pre + 1)}>Inc {count}</button>
      <h1>useEffect && useEffectEvent</h1>
      <p>{dis}</p>
      <button onClick={() => setInc((pre) => pre + 1)}>inc</button>
      {"  "}
      <button
        onClick={() =>
          setInc((pre) => {
            if (pre > 1 && dis > 1) {
              return pre - 1;
            }
            return pre
          })
        }
      >
        dec
      </button>
      <button onClick={() => setDis(0)}>reset</button>
      <h1>useId && useRef</h1>
      <label htmlFor={uniqueId}>name</label>
      <input type="text" id={uniqueId} ref={nameRef} />
      <button onClick={focusRun}>Focus</button>
      <h1>useLayoutEffect</h1>
      <div
        onClick={layout}
        ref={divRef}
        style={{ width: "100px", height: "100px", border: "1px solid green" }}
      >
        click to see popup
      </div>
      <div
        style={{
          display: measure ? "block" : "none",
          width: "50px",
          height: "50px",
          background: "lightgreen",
          position: "fixed",
          top: position.y + 10 + "px",
          left: position.x + 10 + "px",
        }}
      >
        done 🎉
      </div>
      <h1>useMemo</h1>
      {result}
      <label htmlFor={`${uniqueId}-input`}>Factorial</label>
      <input
        defaultValue={factorials}
        onChange={(e) => setFactorials(Number(e.target.value))}
        type="number"
        id={`${uniqueId}-input`}
      />
      <h1>useCallback && memo</h1>
      <button onClick={showMe}>Show notification</button>
      <Btn click={showMe}>hello</Btn>
      <h1>useReducer hook</h1>
      {state.count}
      <button onClick={() => dispatch({ type: "INC", payload: 2 })}>
        Inc
      </button>{" "}
      <button onClick={() => dispatch({ type: "DEC", payload: 2 })}>Dec</button>{" "}
      <button onClick={() => dispatch({ type: "RESET" })}>reset</button>
      <h1>createContext , useContext, custom hook, light dark theme</h1>
      {isDark ? "Dark" : "Light"}
      <button onClick={changeTheme}>{!isDark ? "Dark" : "Light"}</button>

      <h1>createPortal</h1>
      {show && <Modal cencel={changeShow}>you successfully did it 😀🎉</Modal>}
      <button onClick={changeShow}>Show me</button>

      <h1>ErrorBoundry</h1>
      <p>same compo but this get err, and pnent event blank/ white screen</p>
      {/* 
      <ErrorBoundry>
        <CatchErr />
      </ErrorBoundry>

      <p>correct </p>
      <ErrorBoundry>
        <CatchErr data="hi" />
      </ErrorBoundry>
      
      */}

      <h1>Hoc fetch data</h1>
      <Show />

      <h1>useDefferedValue</h1>
      <p>search React keyword see result, get state value as delay</p>
      <input type="text" onChange={(e) => setQuery(e.target.value)} />
      {isPen ? "Searching" : (filter.map((e, i) => (
        <li key={i}>{e}</li>
      )))}

      <h1>custom library  codpro-validator</h1>
      <form action={formAction}>
        <input type="text" {...register("email")} placeholder="email" /><br />
        {errors.email && <p>{errors.email}</p>}
        <input type="password" {...register("password")} placeholder="password" /> <br />
        {errors.password && <p>{errors.password}</p>}
        <button>Submit</button>
      </form>

      <h3>Preview</h3>
      <p>email: {stateData?.email || ""}</p>
      <p>password: {stateData?.password || ""}</p>

      <h1>lazy loading performance better</h1>
      {
        render && (
          <Suspense fallback="loading...">
            <LazyComponent />
          </Suspense>
        )
      }
      <button onClick={() => setRender(pre => !pre)}>show a cop</button>

      <h1>useTransition hook, smooth && low priority</h1>
      <input type="text" onClick={() => setTouched(true)} placeholder="search" value={search} onChange={handleClick} />
      {pending ? ("loading....") :
        (fil.length <= 0 ? (touched ? <h1>no found "{search}"</h1> : "") :
          fil.map((e, i) => {
            return <li key={i}>{e}</li>
          }))
      }

      <h1>useOptimistic</h1>
      <p>Likes: {(Math.floor(optState/100)/10).toFixed(1)}k</p>
      <button onClick={LikePost}>{like ? "♥️" : "🤍"}</button>
    </>
  );
};

export default App;
