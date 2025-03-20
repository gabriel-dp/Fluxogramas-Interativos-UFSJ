export interface Repository<T, CreateTData, UpdateTData> {
	getAll(): Promise<T[]>;
	getOne(id: number): Promise<T | null>;
	create(data: CreateTData): Promise<T>;
	update(id: number, data: UpdateTData): Promise<T>;
	delete(id: number): Promise<T>;
}

export interface Service<T, CreateTData, UpdateTData> {
	getAll(): Promise<T[]>;
	getOne(id: number): Promise<T>;
	create(data: CreateTData): Promise<T>;
	update(id: number, data: UpdateTData): Promise<T>;
	delete(id: number): Promise<T>;
}
