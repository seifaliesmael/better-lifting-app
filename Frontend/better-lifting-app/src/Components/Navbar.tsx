interface Props {
    updateFn: (page: string) => void;
}
const Navbar = ({ updateFn }: Props) => {
    return (
        <div className="container">

            <div className="row">

                <div className="col-2">
                    <div className="btn btn-primary" onClick={() => updateFn("exercises")}> View Exercises </div>
                </div>

                <div className="col-2">
                    <div className="btn btn-primary" onClick={() => updateFn("musclegroups")}> View Muscle Groups </div>
                </div>

                <div className="col-2">
                    <div className="btn btn-primary" onClick={() => updateFn("workouts")}> View Workouts </div>
                </div>

                <div className="col-2">
                    <div className="btn btn-primary" onClick={() => updateFn("createExercise")}> Create New Exercise </div>
                </div>
                <div className="col-2">
                    <div className="btn btn-primary" onClick={() => updateFn("createWorkout")}> Create New Workout </div>
                </div>
                <div className="col-2">
                    <div className="btn btn-primary" onClick={() => updateFn("testDND")}> testDND </div>
                </div>

            </div>

        </div>
    )
}

export default Navbar