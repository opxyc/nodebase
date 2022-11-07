import logger from '~/logger';

const PostgresQueryGenerator = require('sequelize/lib/dialects/postgres/query-generator');

PostgresQueryGenerator.prototype.pgEnum = function (
	tableName: string,
	attr: string,
	dataType: any,
	options: any
) {
	try {
		const enumName = this.pgEnumName(tableName, attr, options);
		let values;

		if (dataType.values) {
			values = `ENUM(${dataType.values
				.map((value: string) => this.escape(value))
				.join(', ')})`;
		} else {
			values = dataType.toString().match(/^ENUM\(.+\)/)[0];
		}

		let sql = `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_${tableName}_${attr}') THEN CREATE TYPE ${enumName} AS ${values}; END IF; END$$;`;
		if (!!options && options.force === true) {
			sql = this.pgEnumDrop(tableName, attr) + sql;
		}
		return sql;
	} catch (err) {
		logger.error(err, {ns: 'PostgresQueryGenerator.prototype.pgEnum'});
		return '';
	}
};

export default {};
