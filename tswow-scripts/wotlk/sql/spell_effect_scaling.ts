/* tslint:disable */
import { tinyint, uint } from '../../data/primitives'
import { Relation } from '../../data/query/Relations'
import { PrimaryKey } from '../../data/table/PrimaryKey'
import { SQLCell, SQLCellReadOnly } from '../../data/sql/SQLCell'
import { SqlRow } from '../../data/sql/SQLRow'
import { SqlTable } from '../../data/sql/SQLTable'

export class spell_effect_scalingRow extends SqlRow<spell_effect_scalingCreator,spell_effect_scalingQuery> {
    @PrimaryKey()
    get spell_id() { return new SQLCellReadOnly<uint, this>(this, 'spell_id') }
    @PrimaryKey()
    get effect_index() { return new SQLCellReadOnly<tinyint, this>(this, 'effect_index') }
    get scaling_id() { return new SQLCell<uint, this>(this, 'scaling_id') }

    clone(spellId: uint, effectIndex: tinyint, c?: spell_effect_scalingCreator): this {
        return this.cloneInternal([spellId, effectIndex], c)
    }
}

export type spell_effect_scalingCreator = {
    scaling_id?: uint,
}

export type spell_effect_scalingQuery = {
    spell_id?: Relation<uint>,
    effect_index?: Relation<tinyint>,
    scaling_id?: Relation<uint>,
}

export class spell_effect_scalingTable extends SqlTable<
    spell_effect_scalingCreator,
    spell_effect_scalingQuery,
    spell_effect_scalingRow> {
    add(spellId: uint, effectIndex: tinyint, c?: spell_effect_scalingCreator): spell_effect_scalingRow {
        const first = this.first()
        if (first) return first.clone(spellId, effectIndex, c)
        return this.rowCreator(this, {}).clone(spellId, effectIndex, c)
    }
}

export const SQL_spell_effect_scaling = new spell_effect_scalingTable(
    'spell_effect_scaling',
    (table, obj) => new spell_effect_scalingRow(table, obj))
