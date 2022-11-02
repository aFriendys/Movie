import { Input, Layout } from 'antd';
import { debounce } from 'lodash';

const { Header } = Layout;
function SearchBar({ fetchData, clearFilms }) {
  const onInputChange = (e) => {
    if (e.target.value === '') {
      clearFilms();
    } else {
      fetchData(e.target.value, 1);
    }
  };

  const debouncedOnchange = debounce(onInputChange, 1000);
  return (
    <Header>
      <Input placeholder="Search a film..." onChange={debouncedOnchange} allowClear />
    </Header>
  );
}

export default SearchBar;
