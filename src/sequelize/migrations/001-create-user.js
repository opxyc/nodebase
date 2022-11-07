'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			google_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	},
};
