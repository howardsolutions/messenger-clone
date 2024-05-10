import { create } from 'zustand'

interface ActiveListStore {
    members: Array<string>;
    add: (id: string) => void;
    remove: (id: string) => void;
    set: (id: Array<string>) => void;
}


const useActiveList = create<ActiveListStore>((set) => ({
    members: [],
    add: (id) => set((state) => ({ members: [...state.members, id] })),
    remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),
    set: (ids) => set({ members: ids })
}));

export default useActiveList;
