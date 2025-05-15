export default function SignIn() {
	return (
		<form>
			<label>
				<p>Username</p>
				<input type="text" />
			</label>
			<label>
				<p>Password</p>
				<input type="password" />
			</label>
			<div>
				<button type="submit">Submit</button>
			</div>
		</form>
	);
}
