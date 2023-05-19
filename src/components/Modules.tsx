import { useRef, useState } from 'react';
import { NodeEditor } from 'rete';
import styled from 'styled-components';
import { ID } from '../consts';
import { ModuleItem } from './ModuleItem';

const Styles = styled.div`
  position: absolute;
  left: 12px;
  top: 12px;
  font-family: Gill Sans, sans-serif;
  button {
    background: white;
    padding: 4px;
    border: none;
    width: 100%;
    color: #555;
    &:hover {
      background: #eee;
      color: #222;
    }
  }
`

const initialData = () => ({ id: ID, nodes: {} });

export function useModules({ getEditor, opened }: { getEditor: () => NodeEditor, opened: () => void }) {
    const [list, setList] = useState<Record<string, any>>({})
    const listRef = useRef<Record<string, any>>({})
    const current = useRef<null | string>(null)//'main')
    const sorted = Object.keys(list).sort((a, b) => a < b ? -1 : 1)

    function sync() {
        if (!current.current) return

        listRef.current[current.current].data = getEditor().toJSON();
    }

    function rename(from: string, to: string) {
        const item = listRef.current[from];

        delete listRef.current[from]
        listRef.current[to] = item

        if (current.current === from) current.current = to
        setList({ ...listRef.current })
    }

    async function openModule(name: string) {
        current.current = name

        await getEditor().fromJSON(listRef.current[name].data);
        opened()
    }

    function addModule(name?: string, data?: any) {
        name = name || 'module' + Object.keys(listRef.current).length;
        data = data || initialData();

        listRef.current[name] = { name, data }
        setList({ ...listRef.current })
    }

    function getCurrent() {
        if (!current.current) return null
        return listRef.current[current.current];
    }

    async function clear() {
        Object.keys(listRef.current).map(name => delete listRef.current[name])

        current.current = null

        await getEditor().fromJSON({
            id: ID,
            nodes: {},
            groups: {}
        } as any);
        setList(listRef.current)
    }

    return {
        get list() {
            return listRef.current
        },
        addModule,
        rename,
        openModule,
        sync,
        getCurrent,
        clear,
        view: (
            <Styles>
                {sorted.map(name => (
                    <ModuleItem
                        key={name}
                        name={name}
                        rename={args => rename(args.from, args.to)}
                        select={name => openModule(name)}
                    >
                        {name}
                    </ModuleItem>
                ))}
                <button onClick={() => addModule()}>+</button>
            </Styles>
        )
    }
}
