import { useRef, useState } from 'react';
import styled from 'styled-components';
import { ModuleItem } from './ModuleItem';
import { exportEditor, importEditor } from '../editor/import-export';
import { DiContainer } from '../editor';
import { Button } from 'antd';

const Styles = styled.div`
  position: absolute;
  left: 12px;
  top: 12px;
  font-family: Gill Sans, sans-serif;
  display: grid;
  gap: 1em;
`

const initialData = () => ({ nodes: [], connections: [] });

export function useModules({ opened }: { opened: () => void }) {
    const [list, setList] = useState<Record<string, any>>({})
    const listRef = useRef<Record<string, any>>({})
    const diRef = useRef<DiContainer>()
    const current = useRef<null | string>(null)
    const sorted = Object.keys(list).sort((a, b) => a < b ? -1 : 1)

    function getEditor() {
        if (!diRef.current?.editor) throw new Error('editor')

        return diRef.current?.editor
    }
    function sync() {
        if (!current.current) return

        listRef.current[current.current] = exportEditor(getEditor());
    }

    function rename(from: string, to: string) {
        const item = listRef.current[from];

        delete listRef.current[from]
        listRef.current[to] = item

        if (current.current === from) current.current = to
        setList({ ...listRef.current })
    }

    async function openModule(name: string) {
        sync()
        current.current = name

        if (!diRef.current) throw new Error('diRef.current')

        await diRef.current.editor.clear()
        await importEditor(diRef.current, listRef.current[name]);
        opened()
    }

    function addModule(name?: string, data?: any) {
        name = name || 'module' + Object.keys(listRef.current).length;
        data = data || initialData();

        listRef.current[name] = data
        setList({ ...listRef.current })
    }

    function getCurrent() {
        if (!current.current) return null
        return listRef.current[current.current];
    }

    async function clear() {
        Object.keys(listRef.current).map(name => delete listRef.current[name])

        current.current = null

        await getEditor().clear()
        setList(listRef.current)
    }

    return {
        get list() {
            return listRef.current
        },
        setDI(di: DiContainer) {
            diRef.current = di
        },
        addModule,
        rename,
        openModule,
        sync,
        getCurrent,
        clear,
        async importModules(target: Record<string, any>) {
            await clear();

            Object.entries(target).map(([name, data]) => {
                addModule(name, data)
            });

            await openModule(Object.keys(target)[0]);
        },
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
                <Button onClick={() => addModule()} size='small'>+</Button>
            </Styles>
        )
    }
}
