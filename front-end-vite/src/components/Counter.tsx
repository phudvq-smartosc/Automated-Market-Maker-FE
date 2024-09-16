import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
} from "../state/counter/counterSlice";
const Counter = () => {
  //NOTE: This used to connect React => Redux
  const count = useSelector((state: RootState) => state.counter.value);

  // TODO: NEED AppDispatch for async action
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h2>{count}</h2>
      <div>
        <button className="btn" onClick={() => dispatch(incrementAsync(32))}>
          Increment
        </button>
        <button className="btn" onClick={() => dispatch(decrement(23))}>
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Counter;
