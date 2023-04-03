import { SearchContainer, SearchInput } from "./styles";

interface ISearch {
	placeholder: string;
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar(props: ISearch) {
	function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
		props.setSearch(event.target.value);
	}

	return (
		<SearchContainer>
			<SearchInput placeholder={props.placeholder} value={props.search} onChange={(event) => handleTextChange(event)} />
		</SearchContainer>
	);
}
