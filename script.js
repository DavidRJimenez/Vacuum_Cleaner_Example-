document.addEventListener("DOMContentLoaded", () => {
    let warehouses = [
        { id: 1, state: getInitialState() },
        { id: 2, state: getInitialState() },
        { id: 3, state: getInitialState() },
        { id: 4, state: getInitialState() },
    ];

    let battery = 2.5; // Battery allows for 2.5 warehouses
    let currentWarehouse = 0;
    let vacuumState = "inactivo"; // possible states: inactivo, limpiando, cargando

    const statusElement = document.getElementById("status");
    const vacuumElement = document.getElementById("vacuum");
    const startButton = document.getElementById("start-button");

    function updateStatus() {
        warehouses.forEach((wh) => {
            const stateElement = document.getElementById(`state-${wh.id}`);
            stateElement.innerText = wh.state;
        });
        statusElement.innerText = `Batería: ${battery.toFixed(2)}, Estado: ${vacuumState}`;
    }

    function getInitialState() {
        const states = ["Limpia no limpiar", "Sucia limpiar", "Ocupada"];
        return states[Math.floor(Math.random() * states.length)];
    }

    function moveToWarehouse(warehouseIndex) {
        const warehouseElement = document.getElementById(`warehouse-${warehouses[warehouseIndex].id}`);
        const warehouseRect = warehouseElement.getBoundingClientRect();
        const vacuumRect = vacuumElement.getBoundingClientRect();

        const left = warehouseRect.left + warehouseRect.width / 2 - vacuumRect.width / 2;
        const top = warehouseRect.top + window.scrollY - vacuumRect.height; // Position above the warehouse

        vacuumElement.style.transform = `translate(${left}px, ${top}px)`;
    }

    function moveToChargingStation() {
        const chargingStation = document.getElementById("charging-station");
        const chargingRect = chargingStation.getBoundingClientRect();
        const vacuumRect = vacuumElement.getBoundingClientRect();

        const left = chargingRect.left + chargingRect.width / 2 - vacuumRect.width / 2;
        const top = chargingRect.top + window.scrollY - vacuumRect.height; // Position above the charging station

        vacuumElement.style.transform = `translate(${left}px, ${top}px)`;
        battery = Math.max(battery - 0.5, 0); // Battery used to move to the charging station, setting to 0
    }

    function chargeBattery() {
        vacuumState = "cargando";
        updateStatus();
        moveToChargingStation();
        setTimeout(() => {
            battery = 2.5; // Reset battery to 2.5 after charging
            resetOccupiedWarehouses();
            vacuumState = "limpiando";
            updateStatus();
            cleanNextWarehouse();
        }, 4000); // Simulate charging time
    }

    function cleanNextWarehouse() {
        if (allWarehousesClean()) {
            finishCleaning();
            return;
        }

        if (currentWarehouse >= warehouses.length) {
            currentWarehouse = 0; // Reset to the first warehouse after completing all
            moveToChargingStation();
            vacuumState = "cargando";
            updateStatus();
            setTimeout(() => {
                battery = 2.5; // Full charge after reaching the base
                resetOccupiedWarehouses();
                vacuumState = "limpiando";
                updateStatus();
                cleanNextWarehouse();
            }, 4000); // Simulate charging time
            return;
        }

        if (battery <= 0.5) {
            chargeBattery();
            return;
        }

        const warehouse = warehouses[currentWarehouse];
        moveToWarehouse(currentWarehouse);

        setTimeout(() => {
            if (warehouse.state === "Sucia limpiar" || warehouse.state === "Libre para limpiar") {
                warehouse.state = "Limpia no limpiar";
            }

            battery -= 1; // Battery used to move to the next warehouse
            currentWarehouse += 1;
            updateStatus();
            cleanNextWarehouse();
        }, 3000); // Simulate cleaning time
    }

    function resetOccupiedWarehouses() {
        warehouses.forEach(wh => {
            if (wh.state === "Ocupada") {
                wh.state = "Libre para limpiar";
            }
        });
    }

    function allWarehousesClean() {
        return warehouses.every(wh => wh.state === "Limpia no limpiar");
    }

    function finishCleaning() {
        moveToChargingStation();
        vacuumState = "inactivo";
        updateStatus();
    }

    startButton.addEventListener("click", () => {
        warehouses = [
            { id: 1, state: getInitialState() },
            { id: 2, state: getInitialState() },
            { id: 3, state: getInitialState() },
            { id: 4, state: getInitialState() },
        ];
        battery = 2.5;
        currentWarehouse = 0; // Start from the first warehouse
        vacuumState = "limpiando";
        updateStatus();
        cleanNextWarehouse();
    });

    updateStatus();
});
