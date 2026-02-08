import './App.css';
import StockForm from './StockForm.jsx';
import StockList from './StockList.jsx';

function App() {

  return (
    <>

        <h1>Finance Dashboard</h1>

        <div className="card">
          <StockForm />
          <StockList />
        </div>

    </>
  );
}

export default App;