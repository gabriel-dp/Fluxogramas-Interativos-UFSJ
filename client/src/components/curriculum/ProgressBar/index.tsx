import { Fill, Track } from "./styles";

interface ProgressBarProps {
	percentage: number;
}

export default function ProgressBar(props: ProgressBarProps) {
	function clamp(n: number, min: number, max: number) {
		return Math.max(min, Math.min(n, max));
	}

	const value = clamp(props.percentage, 0, 100);

	return (
		<Track>
			<Fill $percentage={value.toString()} />
		</Track>
	);
}
