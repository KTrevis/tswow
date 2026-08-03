/* tslint:disable */
import { uint, varchar } from '../../data/primitives'
import { Relation } from '../../data/query/Relations'
import { PrimaryKey } from '../../data/table/PrimaryKey'
import { SQLCell, SQLCellReadOnly } from '../../data/sql/SQLCell'
import { SqlRow } from '../../data/sql/SQLRow'
import { SqlTable } from '../../data/sql/SQLTable'

export class spell_scalingRow extends SqlRow<spell_scalingCreator,spell_scalingQuery> {
    @PrimaryKey()
    get id() { return new SQLCellReadOnly<uint, this>(this, 'id') }
    get name() { return new SQLCell<varchar, this>(this, 'name') }

    clone(id: uint, c?: spell_scalingCreator): this {
        return this.cloneInternal([id], c)
    }
}

export type spell_scalingCreator = {
    name?: varchar,
}

export type spell_scalingQuery = {
    id?: Relation<uint>,
    name?: Relation<varchar>,
}

export class spell_scalingTable extends SqlTable<
    spell_scalingCreator,
    spell_scalingQuery,
    spell_scalingRow> {
    add(id: uint, c?: spell_scalingCreator): spell_scalingRow {
        const first = this.first()
        if (first) return first.clone(id, c)
        return this.rowCreator(this, {}).clone(id, c)
    }
}

export const SQL_spell_scaling = new spell_scalingTable(
    'spell_scaling',
    (table, obj) => new spell_scalingRow(table, obj))
