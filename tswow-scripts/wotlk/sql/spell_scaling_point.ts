/* tslint:disable */
import { float, smallint, uint } from '../../data/primitives'
import { Relation } from '../../data/query/Relations'
import { PrimaryKey } from '../../data/table/PrimaryKey'
import { SQLCell, SQLCellReadOnly } from '../../data/sql/SQLCell'
import { SqlRow } from '../../data/sql/SQLRow'
import { SqlTable } from '../../data/sql/SQLTable'

export class spell_scaling_pointRow extends SqlRow<spell_scaling_pointCreator,spell_scaling_pointQuery> {
    @PrimaryKey()
    get scaling_id() { return new SQLCellReadOnly<uint, this>(this, 'scaling_id') }
    @PrimaryKey()
    get level() { return new SQLCellReadOnly<smallint, this>(this, 'level') }
    get value() { return new SQLCell<float, this>(this, 'value') }

    clone(scalingId: uint, level: smallint, c?: spell_scaling_pointCreator): this {
        return this.cloneInternal([scalingId, level], c)
    }
}

export type spell_scaling_pointCreator = {
    value?: float,
}

export type spell_scaling_pointQuery = {
    scaling_id?: Relation<uint>,
    level?: Relation<smallint>,
    value?: Relation<float>,
}

export class spell_scaling_pointTable extends SqlTable<
    spell_scaling_pointCreator,
    spell_scaling_pointQuery,
    spell_scaling_pointRow> {
    add(scalingId: uint, level: smallint, c?: spell_scaling_pointCreator): spell_scaling_pointRow {
        const first = this.first()
        if (first) return first.clone(scalingId, level, c)
        return this.rowCreator(this, {}).clone(scalingId, level, c)
    }
}

export const SQL_spell_scaling_point = new spell_scaling_pointTable(
    'spell_scaling_point',
    (table, obj) => new spell_scaling_pointRow(table, obj))
