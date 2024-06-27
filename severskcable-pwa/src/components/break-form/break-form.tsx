import { useForm, SubmitHandler } from 'react-hook-form';

const Machines: any = {
    mgv: "МГВ",
    mtv: "МТВ",
    kel701: "КЭЛ 70/1",
    kel702: "КЭЛ 70/2",
    kel90: "КЭЛ 90",
    bm: "БМ",
    mst: "МСТ"
};

interface IFormInput {
    machine: typeof Machines,
}

function BreakForm() {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<IFormInput>()

    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

    return(
        <form className="break-form" onSubmit={handleSubmit(onSubmit)}>
            <input type="submit"/>
        </form>
    );
}

export default BreakForm;