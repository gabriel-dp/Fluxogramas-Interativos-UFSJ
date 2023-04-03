import { SearchContainer, SearchInput } from "./styles";

interface ISearch {
	placeholder: string;
}

export default function SearchBar(props: ISearch) {
	return (
		<SearchContainer>
			<SearchInput placeholder={props.placeholder} />
		</SearchContainer>
	);
}
