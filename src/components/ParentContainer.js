function Parent() {
  const [count, setCount] = React.useState(0);

  // The parent passes count and setCount to children
  return (
    <div>
      <ChildA count={count} />
      <ChildB onIncrement={() => setCount(count + 1)} />
    </div>
  );
}

function ChildA({ count }) {
  return <div>Current count is: {count}</div>;
}

function ChildB({ onIncrement }) {
  return <button onClick={onIncrement}>Increase Count</button>;
}

