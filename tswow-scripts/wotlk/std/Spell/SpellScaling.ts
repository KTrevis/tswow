import { CellSystem } from "../../../data/cell/systems/CellSystem";
import { Table } from "../../../data/table/Table";
import { SQL } from "../../SQLFiles";
import { spell_scalingQuery, spell_scalingRow } from "../../sql/spell_scaling";
import { MainEntity } from "../Misc/Entity";
import { Ids, StaticIDGenerator } from "../Misc/Ids";
import { RegistryStatic } from "../Refs/Registry";

export enum SpellScalingID {
    UNIVERSAL = 1,
}

export type SpellScalingPoint = [level: number, value: number];

export class SpellScalingPoints extends CellSystem<SpellScaling> {
    get(): SpellScalingPoint[] {
        return SQL.spell_scaling_point
            .queryAll({ scaling_id: this.owner.ID })
            .filter(row => !row.isDeleted())
            .sort((left, right) => left.level.get() - right.level.get())
            .map(row => [row.level.get(), row.value.get()]);
    }

    set(points: SpellScalingPoint[]) {
        const sorted = points
            .map(([level, value]) => [level, value] as SpellScalingPoint)
            .sort(([left], [right]) => left - right);

        if (sorted.length === 0 || sorted[0][0] !== 1) {
            throw new Error(`Spell scaling ${this.owner.ID} must define a point at level 1`);
        }

        const levels = new Set<number>();
        for (const [level, value] of sorted) {
            if (!Number.isInteger(level) || level < 1 || level > 65535) {
                throw new Error(`Invalid level ${level} in spell scaling ${this.owner.ID}`);
            }
            if (levels.has(level)) {
                throw new Error(`Duplicate level ${level} in spell scaling ${this.owner.ID}`);
            }
            if (!Number.isFinite(value) || value <= 0) {
                throw new Error(`Invalid value ${value} at level ${level} in spell scaling ${this.owner.ID}`);
            }
            levels.add(level);
        }

        const existing = SQL.spell_scaling_point
            .queryAll({ scaling_id: this.owner.ID });
        existing.forEach(row => row.delete());

        for (const [level, value] of sorted) {
            const row = existing.find(row => row.level.get() === level)
                || SQL.spell_scaling_point.add(this.owner.ID, level);
            row.undelete().value.set(value);
        }
        return this.owner;
    }
}

export class SpellScaling extends MainEntity<spell_scalingRow> {
    get ID() { return this.row.id.get(); }
    get Name() { return this.wrap(this.row.name); }
    readonly Points = new SpellScalingPoints(this);
}

export class SpellScalingRegistryClass extends RegistryStatic<
    SpellScaling,
    spell_scalingRow,
    spell_scalingQuery
> {
    protected Table(): Table<any, spell_scalingQuery, spell_scalingRow> & { add: (id: number) => spell_scalingRow; } {
        return SQL.spell_scaling;
    }

    protected IDs(): StaticIDGenerator {
        return Ids.SpellScaling;
    }

    Clear(entity: SpellScaling, mod: string, id: string): void {
        entity.Name.set(`${mod}:${id}`);
        SQL.spell_scaling_point
            .queryAll({ scaling_id: entity.ID })
            .forEach(row => row.delete());
    }

    protected Clone(mod: string, id: string, entity: SpellScaling, parent: SpellScaling): void {
        entity.Name.set(`${mod}:${id}`);
        entity.Points.set(parent.Points.get());
    }

    protected FindByID(id: number): spell_scalingRow {
        return SQL.spell_scaling.query({ id }) as spell_scalingRow;
    }

    protected EmptyQuery(): spell_scalingQuery { return {}; }
    ID(entity: SpellScaling): number { return entity.ID; }
    protected Entity(row: spell_scalingRow): SpellScaling { return new SpellScaling(row); }
}

export const SpellScalingRegistry = new SpellScalingRegistryClass();
